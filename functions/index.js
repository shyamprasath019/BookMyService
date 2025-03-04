const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.placeBid = functions.https.onCall((data, context) => {
  const { projectId, freelancerId, bidAmount } = data;

  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Only authenticated users can place bids'
    );
  }

  return db.collection('projects').doc(projectId).collection('bids').add({
    freelancerId,
    bidAmount,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  })
  .then(() => {
    return { message: 'Bid placed successfully' };
  })
  .catch((error) => {
    throw new functions.https.HttpsError('internal', 'Bid placement failed', error);
  });
});
