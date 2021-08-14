import firebase from "firebase/app";
import 'firebase/database';
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { openModal } from "../redux/actions/modalSpinnerActions";


export const useAddAbsenceRequest = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  return (requestDetails) => {
    firebase.database().ref('/absence-requests/')
      .push(requestDetails)
      .then(() => {
        dispatch(openModal({
          type: 'success',
          content: 'The request has been succecssfully added!',
          okButtonHandler: () => history.push('/absence-requests')
        }));
      })
      .catch(() => {
        dispatch(openModal({
          content: 'Cannot send absence request, please try again later!'
        }));
      })
  }
}

export const useLogOT = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  return (otLogId, logDetails) => {
    firebase.database().ref('/ot-logs/' + otLogId).set(logDetails)
      .then(() => {
        dispatch(openModal({
          type: 'success',
          content: 'The OT has been successfully logged!',
          okButtonHandler: () => history.push('/ot-logs')
        }));
      })
      .catch(() => {
        dispatch(openModal({
          content: 'Something went wrong, cannot perform OT log, please try again later!'
        }));
      })
  }
}