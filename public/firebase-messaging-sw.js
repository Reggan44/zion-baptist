importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDYNrZVsvcRkiOBCwBKhUhlezhWnEkXBUw",
  authDomain: "aic-happy-valley.firebaseapp.com",
  projectId: "aic-happy-valley",
  storageBucket: "aic-happy-valley.firebasestorage.app",
  messagingSenderId: "1091541177539",
  appId: "1:1091541177539:web:b624752f3038ced6363e76"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
