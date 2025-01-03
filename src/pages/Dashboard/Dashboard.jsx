import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import CreateMod from "../../components/CreateModal/CreateMod";
import ShareMod from "../../components/ShareModal/ShareMod";
import DeleteMod from "../../components/DeleteModal/DeleteMod";
import delIcon from "../../assets/del-icon.png";
import folderIcon from "../../assets/folder-icon.png";
import plusIcon from "../../assets/plus-icon.png";
import styles from "./dashboard.module.css";
import {
  getDashboard,
  createDashboardItem,
  deleteDashboardItem,
  getSharedDashboards,
  accessSharedDashboard,
} from "../../services/api";

export default function Dashboard() {
  const [mainDirectory, setMainDirectory] = useState({
    forms: [],
    folders: {},
  });
  const [sharedDashboards, setSharedDashboards] = useState([]); // List of shared dashboards
  const [currentDashboardOwner, setCurrentDashboardOwner] = useState("my");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [highlightedFolder, setHighlightedFolder] = useState(""); // Highlighted folder
  const [createModalText, setCreateModalText] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Create modal state
  const [currentFolder, setCurrentFolder] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteModalText, setDeleteModalText] = useState("");
  const [itemToDelete, setItemToDelete] = useState({
    name: "",
    type: "",
    folder: null,
  });
  // const [statusMessage, setStatusMessage] = useState("");
  // const location = useLocation();
  // const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true); // Open modal
  const closeModal = () => setIsModalOpen(false); // Close modal

  // Fetch user dashboard

  const fetchUserDashboard = async () => {
    try {
      const response = await getDashboard();
      // console.log("Status main Code:", response.data);
      if (response.status === 201) {
        console.log("New dashboard created:", response.data.dashboard);
        setMainDirectory(response.data.dashboard.mainDirectory);
      } else if (response.status === 200) {
        // console.log("Existing dashboard fetched:", response.data);
        setMainDirectory(response.data.mainDirectory);
      }
    } catch (error) {
      console.error("Error fetching user dashboard:", error);
    }
  };

  // Fetch shared dashboards
  const fetchSharedDashboards = async () => {
    try {
      const response = await getSharedDashboards();
      // console.log("Status shared Code:", response);
      // console.log("Shared Dashboards 111111:", response.data);
      if (response.status === 200) {
        setSharedDashboards(response.data.sharedBy); // Populate shared dashboards
      }
    } catch (error) {
      console.error("Error fetching shared dashboards:", error);
    }
  };

  // const handleAccessSharedDashboard = async (token) => {
  //   try {
  //     const response = await accessSharedDashboard(token);
  //     if (response.status === 200) {
  //       setStatusMessage("Shared dashboard access granted successfully!");
  //       fetchSharedDashboards();
  //       navigate("/dashboard");
  //     } else {
  //       setStatusMessage(
  //         response.data.message || "Failed to access shared dashboard."
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error accessing shared dashboard:", error);
  //     setStatusMessage("An error occurred while accessing the dashboard.");
  //   }
  // };

  // useEffect(() => {
  //   const token = new URLSearchParams(location.search).get("token");
  //   if (token) {
  //     handleAccessSharedDashboard(token);
  //   } else {
  //     fetchUserDashboard();
  //     fetchSharedDashboards();
  //   }
  // }, [location]);

  useEffect(() => {
    fetchUserDashboard();
    fetchSharedDashboards();
  }, []);

  // Switch between user and shared dashboards
  const switchDashboard = async (dashboardOwner) => {
    if (dashboardOwner === "my") {
      fetchUserDashboard(); // Load the user's dashboard
    } else {
      const shared = sharedDashboards.find(
        (dash) => dash.email === dashboardOwner
      );
      if (shared) {
        console.log(`Switching to shared dashboard by: ${dashboardOwner}`);
        setMainDirectory({
          forms: shared.forms || [], // Example data from shared dashboard
          folders: shared.folders || {}, // Example data from shared dashboard
        });
        console.log("Shared Dashboard Data:", shared);
        console.log("Shared Forms:", shared.forms);
        console.log("Shared Folders:", shared.folders);
      }
    }
    setCurrentDashboardOwner(dashboardOwner); // Update current owner
  };

  const openCreateModal = (text, folder = currentFolder) => {
    setCreateModalText(text);
    setIsCreateModalOpen(true);
    setCurrentFolder(folder);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  }; // Close create modal

  const openDeleteModal = (name, type, folder = null) => {
    setDeleteModalText(type === "folder" ? "folder" : "form");
    setItemToDelete({ name, type, folder });
    setIsDeleteModalOpen(true);
  }; // Open delete modal

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete({ name: "", type: "", folder: null });
  }; // Close delete modal

  // Create Folder
  const handleCreateFolder = async (folderName) => {
    try {
      await createDashboardItem(
        folderName,
        "folder",
        null,
        currentDashboardOwner
      );
      setMainDirectory((prev) => ({
        ...prev,
        folders: {
          ...prev.folders,
          [folderName]: [],
        },
      }));
      setHighlightedFolder(folderName);
      setCurrentFolder(folderName);
      closeCreateModal();
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  // Create Form
  const handleCreateForm = async (formName) => {
    try {
      await createDashboardItem(
        formName,
        "form",
        currentFolder,
        currentDashboardOwner
      );
      if (currentFolder) {
        setMainDirectory((prev) => ({
          ...prev,
          folders: {
            ...prev.folders,
            [currentFolder]: [...prev.folders[currentFolder], formName],
          },
        }));
      } else {
        setMainDirectory((prev) => ({
          ...prev,
          forms: [...prev.forms, formName],
        }));
      }
      closeCreateModal();
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  // Delete Folder
  const handleDeleteFolder = async (folderName) => {
    try {
      await deleteDashboardItem(
        folderName,
        "folder",
        null,
        currentDashboardOwner
      );
      setMainDirectory((prev) => {
        const { [folderName]: _, ...remainingFolders } = prev.folders;
        return {
          ...prev,
          folders: remainingFolders,
        };
      });
      if (highlightedFolder === folderName) {
        setHighlightedFolder("");
        setCurrentFolder(null);
      }
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  // Delete Form
  const handleDeleteForm = async (formName) => {
    try {
      await deleteDashboardItem(
        formName,
        "form",
        currentFolder,
        currentDashboardOwner
      );
      if (currentFolder) {
        setMainDirectory((prev) => ({
          ...prev,
          folders: {
            ...prev.folders,
            [currentFolder]: prev.folders[currentFolder].filter(
              (form) => form !== formName
            ),
          },
        }));
      } else {
        setMainDirectory((prev) => ({
          ...prev,
          forms: prev.forms.filter((form) => form !== formName),
        }));
      }
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };

  const handleFolderClick = (folderName) => {
    setHighlightedFolder(folderName);
    setCurrentFolder(folderName);
  };

  const hasEditAccess =
    currentDashboardOwner === "my" ||
    sharedDashboards.some(
      (shared) =>
        shared.email === currentDashboardOwner && shared.accessType === "edit"
    );

  return (
    <div className={styles.dashboardContainer}>
      <Navbar
        openModal={openModal}
        isModalOpen={isModalOpen}
        currentFolder={currentFolder}
        setCurrentFolder={setCurrentFolder}
        setHighlightedFolder={setHighlightedFolder}
        sharedDashboards={sharedDashboards}
        switchDashboard={switchDashboard}
        currentDashboardOwner={currentDashboardOwner} // Pass the owner
      />
      <div className={styles.dashShareMod}>
        {isModalOpen && <ShareMod closeModal={closeModal} />}
      </div>

      <div className={styles.dashCreateMod}>
        {isCreateModalOpen && (
          <CreateMod
            text={createModalText}
            onCreate={
              createModalText === "Folder"
                ? handleCreateFolder
                : handleCreateForm
            }
            closeCreateModal={closeCreateModal}
          />
        )}
      </div>

      <div className={styles.dashDeleteMod}>
        {isDeleteModalOpen && (
          <DeleteMod
            text={deleteModalText}
            onDelete={() =>
              itemToDelete.type === "folder"
                ? handleDeleteFolder(itemToDelete.name)
                : handleDeleteForm(itemToDelete.name, itemToDelete.folder)
            }
            closeDeleteModal={closeDeleteModal}
          />
        )}
      </div>

      <div className={styles.dashboardContent}>
        <div className={styles.folderContainer}>
          <div className={styles.box}>
            <button
              className={styles.folderBoxMainBtn}
              // onClick={() => openCreateModal("Folder")}
              // disabled={isCreateModalOpen}
              // style={{
              //   cursor: isCreateModalOpen ? "not-allowed" : "pointer",
              // }}
              onClick={() => hasEditAccess && openCreateModal("Folder")}
              disabled={!hasEditAccess || isCreateModalOpen}
              style={{
                cursor:
                  !hasEditAccess || isCreateModalOpen
                    ? "not-allowed"
                    : "pointer",
                opacity: !hasEditAccess ? 0.6 : 1, // Visual feedback for disabled state
              }}
            >
              <img
                src={folderIcon}
                alt=""
                style={{ paddingBottom: "5px", marginRight: "8px" }}
              />
              <span>Create a folder</span>
            </button>
          </div>

          {Object.keys(mainDirectory.folders).map((folderName, index) => (
            <div
              key={index}
              className={`${styles.box} ${
                highlightedFolder === folderName ? styles.highlighted : ""
              }`}
              onClick={() => handleFolderClick(folderName)}
            >
              {folderName}
              <span
                onClick={(e) => {
                  if (hasEditAccess) {
                    e.stopPropagation();
                    openDeleteModal(folderName, "folder");
                  }
                }}
                style={{
                  cursor: hasEditAccess ? "pointer" : "not-allowed",
                  opacity: hasEditAccess ? 1 : 0.6, // Visual feedback for disabled state
                }}
              >
                <img src={delIcon} alt="Delete Folder" />
              </span>
            </div>
          ))}
        </div>

        <div className={styles.formBotContainer}>
          <button
            className={styles.formBoxMainBtn}
            onClick={() => openCreateModal("Form")}
            // disabled={isCreateModalOpen}
            disabled={!hasEditAccess || isCreateModalOpen}
            style={{
              cursor:
                !hasEditAccess || isCreateModalOpen ? "not-allowed" : "pointer",
              opacity: !hasEditAccess ? 0.5 : 1, // Visually indicate disabled state
            }}
          >
            <div className={styles.formBoxMain}>
              <div
                className={styles.mainBoxComponent}
                style={{
                  cursor: isCreateModalOpen ? "not-allowed" : "pointer",
                }}
              >
                <img src={plusIcon} alt="" />
                <div>Creta a TypeBot</div>
              </div>
            </div>
          </button>

          {currentFolder
            ? mainDirectory.folders[currentFolder]?.map((form, index) => (
                <div key={index} className={styles.formBox}>
                  {currentDashboardOwner === "my" ? (
                    <Link
                      to={`/workspace/${form}`}
                      className={styles.forBoxComponent}
                    >
                      <div>{form}</div>
                    </Link>
                  ) : (
                    <div
                      className={`${styles.forBoxComponent} ${styles.disabled}`}
                      title="Access restricted to shared dashboards"
                      style={{ cursor: "not-allowed", opacity: 0.6 }}
                    >
                      <div>{form}</div>
                    </div>
                  )}

                  <img
                    src={delIcon}
                    alt="Delete Form"
                    className={styles.boxImg}
                    // onClick={() => handleDeleteForm(form, currentFolder)}
                    // onClick={() => openDeleteModal(form, "form", currentFolder)}
                    onClick={() =>
                      hasEditAccess &&
                      openDeleteModal(form, "form", currentFolder)
                    }
                    style={{
                      cursor: hasEditAccess ? "pointer" : "not-allowed",
                      opacity: hasEditAccess ? 1 : 0.5, // Indicate disabled state
                    }}
                  />
                </div>
              ))
            : mainDirectory.forms?.map((form, index) => (
                <div key={index} className={styles.formBox}>
                  {currentDashboardOwner === "my" ? (
                    <Link
                      to={`/workspace/${form}`}
                      className={styles.forBoxComponent}
                    >
                      <div>{form}</div>
                    </Link>
                  ) : (
                    <div
                      className={`${styles.forBoxComponent} ${styles.disabled}`}
                      title="Access restricted to shared dashboards"
                      style={{ cursor: "not-allowed", opacity: 0.6 }}
                    >
                      <div>{form}</div>
                    </div>
                  )}

                  <img
                    src={delIcon}
                    alt="Delete Form"
                    className={styles.boxImg}
                    // onClick={() => handleDeleteForm(form)}
                    // onClick={() => openDeleteModal(form, "form")}
                    onClick={() =>
                      hasEditAccess && openDeleteModal(form, "form")
                    }
                    style={{
                      cursor: hasEditAccess ? "pointer" : "not-allowed",
                      opacity: hasEditAccess ? 1 : 0.5, // Indicate disabled state
                    }}
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
