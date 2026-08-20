import * as Notification from 'expo-notifications'
import {useEffect, useRef} from "react";
import {GetDistanceInKm} from "../Utils/Utils";

Notification.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    })
});

export const sendParkingNotification = async(parkingName) => {
    await Notification.scheduleNotificationAsync({
        content:{
            title: "Stationnement a proximite",
            body: `Vous etes a moins de 100m de : ${parkingName}`,
            sound: true,
        },
        trigger:null,
    });
};
export default function NotificationCmp({userLocation, parkingData, thresHoldKm = 0.1, }) {
    const notificationParkings = useRef(new Set());
    useEffect(() => {
        const requestPermission = async () => {
            const {status} = await Notification.requestPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission pour envoyer des notification refusee');
            }
        };
        requestPermission();
    }, []);

    useEffect(() => {
        if (!userLocation || !parkingData || parkingData.length === 0) return;
        parkingData.forEach(parking => {
            const parkingLatitude = parseFloat(parking.nLatitude);
            const parkingLongitude = parseFloat(parking.nLongitude);
            if (!isNaN(parkingLatitude) && !isNaN(parkingLongitude)) {
                const distance = GetDistanceInKm(userLocation.latitude, userLocation.longitude, parkingLatitude, parkingLongitude);

                if (distance <= thresHoldKm && !notificationParkings.current.has(parking._id)) {
                    sendParkingNotification(parking.sNoPlace).then(() => {
                        notificationParkings.current.add(parking._id);
                    }).catch(err => console.log(err));
                }
            }
        });
    }, [userLocation, parkingData, thresHoldKm]);
    return null
}