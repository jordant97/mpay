import maybank from "./assets/images/maybank.jpg";
import cimb from "./assets/images/cimb.jpg";
import hlb from "./assets/images/hlb.jpg";
import pbe from "./assets/images/pbe.jpg";
import rhb from "./assets/images/rhb.jpg";
import bsn from "./assets/images/bsn.jpg";

const banks = {
  MBB: {
    name: "Maybank",
    logo: maybank,
    primaryColor: "#ffc700",
    secondaryColor: "black",
    fontColor: "#ffffff",
    bodyFontColor: "black",
    warningColor: "white",
    borderColor: "#d2d2d2",
  },
  CIMB: {
    name: "CIMB Bank",
    logo: cimb,
    primaryColor: "#ffffff",
    secondaryColor: "#770002",
    fontColor: "#ffffff",
    bodyFontColor: "#770002",
    warningColor: "#ffffff",
    borderColor: "#770002",
    buttonHoverColor: "red",
  },
  HLB: {
    name: "Hong Leong Bank",
    logo: hlb,
    primaryColor: "#ffffff",
    secondaryColor: "#f5f5f5",
    fontColor: "#194889",
    bodyFontColor: "#194889",
    warningColor: "red",
    borderColor: "#d2d2d2",
  },
  PBE: {
    name: "Public Bank",
    logo: pbe,
    primaryColor: "#ffffff",
    secondaryColor: "#f5f5f5",
    fontColor: "#194889",
    bodyFontColor: "#194889",
    warningColor: "red",
    borderColor: "#d2d2d2",
  },
  RHB: {
    name: "RHB Bank",
    logo: rhb,
    primaryColor: "#ffffff",
    secondaryColor: "#0052af",
    fontColor: "white",
    bodyFontColor: "#0052af",
    warningColor: "white",
    borderColor: "#4ad2e9",
    buttonHoverColor: "#4ad2e9",
  },
  BSN: {
    name: "BSN Bank",
    logo: bsn,
    primaryColor: "#ffffff",
    secondaryColor: "#01C0D1",
    fontColor: "white",
    bodyFontColor: "#00A2B1",
    warningColor: "white",
    borderColor: "#white",
    buttonHoverColor: "#4ad2e9",
  },
};

export default banks;
