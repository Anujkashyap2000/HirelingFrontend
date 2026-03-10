import "./footer.css";
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-section">
        <h1 className="Designed-for-companies">
          Designed for companies
        </h1>
        <p>
          We are a team of passionate people whose goal is to improve everyone's life through disruptive products. We build great products to solve your business problems. Our products are designed for small to medium size companies willing to optimize their performance.
        </p>
        <br />
        <p>copyright @Hireling.</p>
      </div>

      <div className="footer-section">
        <h2 className="address">
          Hireling <br />"Your Home, Our Expertise"
        </h2>
        <p>
          Aligarh college of Engineering and technology, <br />
          Mathura Road, <br />
          Aligarh<br />
          Pincode: 202001
        </p>
      </div>

      <div className="footer-section social-sites">
        <a href=""><p><PhoneIcon />&nbsp; +91 8532911143</p></a>
        <a href=""><p><EmailIcon /> &nbsp; anuj2025kashyap@gmail.com</p></a>
        <br />
        <div className="icon-group">
          <a href="https://github.com/Anujkashyap2000/"><GitHubIcon /></a>
          <a href="https://x.com/anujkashyap1143"><XIcon /></a>
          <a href="https://www.instagram.com/anujkashyap11/"><InstagramIcon /></a>
          <a href="https://www.linkedin.com/in/anuj-kumar-901890232/"><LinkedInIcon /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;