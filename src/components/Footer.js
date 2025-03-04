import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <h2 className="footerTitle">Book My Service</h2>
      <button className="contactButton" onClick={() => alert('<p>Email: support@bookmyservice.com</p><p>Phone: +91 1234567890</p>')}>
        Contact Us
      </button>
      <p className="footerText">© 2025 BookMyService. All Rights Reserved.</p>
    </div>
  );
};

export default Footer;


// import React from 'react';
// import './Footer.css';

// function Footer() {
//   return (
//     <footer className="footer">
//       <div className="footer-content">
//         <div className="contact-info">
//           <h4>Contact Us</h4>
//           <p>Email: support@bookmyservice.com</p>
//           <p>Phone: +91 1234567890</p>
//         </div>
//         <div className="social-media">
//           <h4>Follow Us</h4>
//           <p>Facebook | Twitter | Instagram</p>
//         </div>
//       </div>
//       <div className="copyright">
//         <p>&copy; 2024 BookMyService. All rights reserved.</p>
//       </div>
//     </footer>
//   );
// }

// export default Footer;
