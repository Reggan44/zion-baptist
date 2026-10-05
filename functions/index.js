const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendBroadcastNotification = functions.firestore
  .document('notifications/{notificationId}')
  .onCreate(async (snap, context) => {
    const notification = snap.data();

    // Fetch all tokens from Firestore fcm_tokens collection
    const tokensSnapshot = await admin.firestore().collection('fcm_tokens').get();
    
    if (tokensSnapshot.empty) {
      console.log('No registered devices found. Skipping broadcast.');
      return null;
    }

    const tokens = [];
    tokensSnapshot.forEach(doc => {
      // The token string is used as the document ID in the fcm_tokens collection
      tokens.push(doc.id);
    });

    // Multicast payload format
    const payload = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      tokens: tokens, // Array of target device tokens
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(payload);
      console.log(`Successfully sent message: ${response.successCount} messages were sent successfully`);
      
      // Cleanup invalid tokens (if users uninstalled the app or revoked permissions)
      if (response.failureCount > 0) {
        const failedTokens = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            // Check for specific error codes for invalid tokens
            if (resp.error.code === 'messaging/invalid-registration-token' ||
                resp.error.code === 'messaging/registration-token-not-registered') {
              failedTokens.push(tokens[idx]);
            }
          }
        });
        
        if (failedTokens.length > 0) {
          console.log(`Cleaning up ${failedTokens.length} defunct tokens.`);
          const batch = admin.firestore().batch();
          failedTokens.forEach(token => {
            const tokenRef = admin.firestore().collection('fcm_tokens').doc(token);
            batch.delete(tokenRef);
          });
          await batch.commit();
        }
      }
      return null;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  });
