import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";


// input: yyyy-mm-dd
// output: dd/mm/yyyy
export const inputDateToDateString = (inputDate) => {
    return new Date(inputDate).toLocaleDateString('en-uk');
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
    const storageRef = firebase.storage().ref('profile-images/' + imageName);
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

export const uploadMultipleFilesAndGetURLs = (files, filesNames) => {
    const promises = files.map((file, index) => {
        return firebase.storage().ref('ot-files/' + filesNames[index]).put(file)
            .then(snapshot => {
                return snapshot.ref.getDownloadURL();
            })
            .then(url => {
                return {
                    name: file.name,
                    url: url
                };
            })
            .catch(() => {
                return null;
            })
    })

    return Promise.all(promises);
}

export const deleteMultipleFiles = (fileNames) => {
    return fileNames.map(fileName => {
        return firebase.storage().ref('ot-files').child(fileName).delete();
    })
}