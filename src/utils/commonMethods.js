import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";

export const timestampInSecsToDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-UK");  // format dd/mm/yyyy
}

export const dateStringToInputTypeDateFormat = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
}

export const dateStringToTimestampSecs = (dateString) => {
    return new Date(dateString).getTime() / 1000;
}

export const timestampMsToInputDate = (timestamp) => {
    const dateString = timestampInSecsToDate(timestamp);
    return dateStringToInputTypeDateFormat(dateString);
}


export const getUserAssociatedWithEmail = (email) => {
    return firebase.database().ref('/users')
        .orderByChild('email')
        .equalTo(email)
        .once('value')
        .then(snapshot => {
            const [id, userDetails] = Object.entries(snapshot.val())[0];
            userDetails.id = id;
            return userDetails;
        })
        .catch(() => {
            return null
        })
}

export const getUserAssociatedWithId = (id) => {
    return firebase.database().ref('/users/' + id)
        .once('value')
        .then(snapshot => {
            const userDetails = snapshot.val();
            userDetails.id = id;
            return userDetails;
        })
        .catch(() => {
            return null
        })
}

export const uploadImageAndGetURL = (imageFile, imageName) => {
    const storage = firebase.storage();
    const storageRef = storage.ref('profile-images/' + imageName);
    return storageRef.put(imageFile)
        .then(() => {
            return storageRef.getDownloadURL()
                .then(url => {
                    return url;
                })
        }).catch(() => {
            return null;
        })
}