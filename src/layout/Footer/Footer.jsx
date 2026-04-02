import React from "react";
import "./Footer.css";
import { useTranslation } from "react-i18next";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  
  return (
    <footer className="footer">
      <i className="far fa-copyright"></i>
      <span>
        {currentYear} {t("Footer.copyright")}
      </span>
    </footer>
  );
};

export default Footer;
