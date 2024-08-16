import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";

import './UserDelete.css';

export default function UserDelete() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const userId = auth.userId;

  const toggleDeleteWarningHandler = () => {
    setShowConfirmModal(!showConfirmModal);
  };

  const navigate = useNavigate();

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`,
        "DELETE",
        '',
        {'Authorization': `Bearer ${auth.token}`}
      );
      navigate("/auth");
    } catch (error) {
      console.log(error);
    }
  };

  const cancelButtonhandler = () => {
    return navigate("/");
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <Modal
        show={showConfirmModal}
        onCancel={toggleDeleteWarningHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={toggleDeleteWarningHandler}>
              Cancel
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          Your account will be permanently deleted, along with all your Data.
          You can NOT undo this action.
        </p>
      </Modal>
      <div className="center">
        <div className="user-delete-item ">
      <Card className='user-delete__content'>
        <h2>Delete Account?</h2>
        <div className="user-delete__info">
        <Button danger onClick={toggleDeleteWarningHandler}>
          Delete Account
        </Button>
        <Button inverse onClick={cancelButtonhandler}>
          Cancel
        </Button>
        </div>
      </Card>
      </div>
      </div>
    </>
  );
}
