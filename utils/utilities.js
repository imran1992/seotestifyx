import { parsePhoneNumber } from "libphonenumber-js/mobile";
const developerMode = false;
const InfoLogger = (title, Detail) => {
  developerMode && console.log(title + " :\n", Detail);
};
const WarningLogger = (title, Detail) => {
  developerMode && console.warn("WARNING (" + title + ") :\n", Detail);
};
const ErrorLogger = (title, Detail) => {
  developerMode && console.error("ERROR (" + title + ") :\n", Detail);
};
const EMAIL_FORMAT = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
const NAME_FORMAT = /^[A-Za-z\s]+$/;
const First_LastNameFormat = /^[a-zA-Z]+ [a-zA-Z]+$/;
const EmailValidator = (email) => (EMAIL_FORMAT.test(email) ? true : false);

const NameValidator = (name) => (NAME_FORMAT.test(name) ? true : false);

const First_LastNameFormatValidator = (name) =>
  First_LastNameFormat.test(name) ? true : false;

const phoneNumberValidator = (phoneNumber) => {
  let ForOurOwnSafty = phoneNumber;
  if (phoneNumber.indexOf("0092") === 0) {
    ForOurOwnSafty = ForOurOwnSafty.replace("0092", "");
  } else if (phoneNumber.indexOf("92") === 0) {
    ForOurOwnSafty = ForOurOwnSafty.replace("92", "");
  } else if (phoneNumber.indexOf("+92") === 0) {
    ForOurOwnSafty = ForOurOwnSafty.replace("+92", "");
  } else if (phoneNumber.indexOf("0") === 0) {
    ForOurOwnSafty = ForOurOwnSafty.replace("0", "");
  }
  let internationalFormatcell = "",
    valid = false;
  try {
    const numberWeWant = parsePhoneNumber(ForOurOwnSafty, "PK");
    valid = numberWeWant.isValid();
    internationalFormatcell =
      valid === true ? numberWeWant.formatInternational() : "";
  } catch (e) {
    internationalFormatcell = "";
    valid = false;
  }
  return {
    internationalFormatcell: internationalFormatcell.replace(/[a-zA-Z+ ]/g, ""),
    valid,
  };
};
const numberFormator = (num) => {
  //const formatedNumber=num.replace(/[a-zA-z+ ]/g, "");
  const formatedNumber = num.replace("+", "");
  return formatedNumber.replace(/\s+/g, "");
};
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const containsObject = async (id, array) => {
  let i,
    { length } = array;
  for (i = 0; i < length; i++) {
    if (array[i].variant._id === id) {
      return i;
    }
  }
  return -1;
};
const getCartItemQuantity = (Arr) => {
  let Totalitem = 0;
  if (Arr.length)
    Arr.map((item, index) => {
      Totalitem = Totalitem + item.quantity;
    });
  return Totalitem;
};
const GetTotalPrice = (Arr) => {
  let TotalPrice = 0;
  if (Arr.length)
    Arr.map((item, index) => {
      TotalPrice = TotalPrice + item.quantity * item.Price;
    });
  return TotalPrice;
};
const checkWishlistItemExist = (wishlistArray, itemToBeCheck) => {
  let index = 0,
    foundAt = -1;
  const { length } = wishlistArray;
  const { product, variant } = itemToBeCheck;
  if (length !== 0)
    for (index; index < length; index++) {
      if (
        wishlistArray[index].product._id === product._id &&
        wishlistArray[index].variant._id === variant._id
      ) {
        foundAt = index;
        break;
      }
    }

  return foundAt;
};
const sorts = [
  { _id: "Relevance", name: "No order", val: null },
  { _id: "Whats New", name: "New first", val: "-createdAt" },
  {
    _id: "Price low to high",
    name: "Price low to high",
    val: "price",
  },
  {
    _id: "Price high to low",
    name: "Price high to low",
    val: "-price",
  },
];
const isEmpty = (obj) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};
const stringMaker = (AppliedFilters) => {
  let FilterString = "";
  for (let key in AppliedFilters) {
    if (AppliedFilters.hasOwnProperty(key)) {
      if (key === "Sort") {
        if (AppliedFilters[key].content)
          FilterString = "&sort=" + AppliedFilters[key].content;
      } else if (key === "price") {
        FilterString =
          FilterString + "&" + key + "=" + AppliedFilters[key].content;
      } else {
        if (AppliedFilters[key].content.length)
          FilterString =
            FilterString + "&" + key + "=" + AppliedFilters[key].content;
      }
    }
  }
  return FilterString;
};
const stringMakerForSearch = (AppliedFilters) => {
  let FilterString = "";
  for (let key in AppliedFilters) {
    if (AppliedFilters.hasOwnProperty(key)) {
      if (key === "Sort") {
        if (AppliedFilters[key].content)
          FilterString = "sort=" + AppliedFilters[key].content;
      } else if (key === "price") {
        FilterString =
          FilterString !== ""
            ? FilterString + "&" + key + "=" + AppliedFilters[key].content
            : key + "=" + AppliedFilters[key].content;
      } else {
        if (AppliedFilters[key].content.length)
          FilterString =
            FilterString !== ""
              ? FilterString + "&" + key + "=" + AppliedFilters[key].content
              : key + "=" + AppliedFilters[key].content;
      }
    }
  }
  return FilterString;
};
const OurTimeShower = (startTime) => {
  const date = new Date(startTime);
  return `${date.toLocaleDateString("en-US", {
    day: "numeric",
    weekday: "short",
    month: "short",
  })} ,${date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};
const OurTimeShower2 = (startTime) => {
  const date = new Date(startTime);
  return {
    month: date.toLocaleDateString("en-US", {
      month: "short",
    }),
    day: date.toLocaleDateString("en-US", {
      day: "numeric",
    }),
    weekday: date.toLocaleDateString("en-US", {
      weekday: "long",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};
const tConvert = (time) => {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
};
const ExtractDateAndTime = (FullDateTime) => {
  const Splited = FullDateTime.split("T");
  if (Splited.length === 2) {
    const dDate = Splited[0];
    const Convert24Clock = Splited[1].substring(0, 8);
    const dTime = tConvert(Convert24Clock);
    const dateWithTime = `${dDate}, ${dTime}`;
    return { dDate, dTime, dateWithTime };
  }
  return FullDateTime;
};

const TimeStatus = (STATUS) => {
  let dateString = "";
  if (STATUS !== "Delivered") {
    let dt = new Date();
    if (STATUS === "Placed") dt.setDate(dt.getDate() + 5);
    else if (STATUS === "Processing" || STATUS === "Shipped")
      dt.setDate(dt.getDate() + 3);
    else if (STATUS === "Dispatched") dt.setDate(dt.getDate() + 2);
    const date = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();
    dateString = date + " " + monthNames[month];
  }

  return dateString;
};

const firstLetterCapital = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);
const CategoryExtractor = (STR) => {
  const res = STR.slice(14);
  const index = res.indexOf("?");
  return index !== -1 ? res.slice(0, index) : res;
};
const FilterExtract = (STR) => {
  const index = STR.indexOf("?");
  return index !== -1 ? STR.slice(index + 1, STR.length) : "";
};
const FilterMaker = ({ sizes, brands, Color, price, sort }) => {
  let Filter = "";

  if (sizes !== undefined && sizes.length !== 0) Filter = "sizes=" + sizes;
  sort !== undefined &&
    (Filter = Filter + (Filter !== "" ? "&sort=" : "sort=") + sort);
  if (brands !== undefined && brands.length !== 0)
    Filter = Filter + (Filter !== "" ? "&brands=" : "brands=") + brands;
  if (Color !== undefined && Color.length !== 0)
    Filter = Filter + (Filter !== "" ? "&Color=" : "Color=") + Color;
  if (price !== undefined && price.length !== 0)
    Filter = Filter + (Filter !== "" ? "&price=" : "price=") + price;
  return Filter;
};
const timeLefter = (timeto) => {
  const timeDiff = new Date(timeto) - Date.now();
  let dateTimeString = "";
  let delta = timeDiff / 1000;
  if (delta > 1) {
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = delta % 60;
    const DAYZ = days ? days + ` ${days > 1 ? "days " : "day "}` : "";
    const HOURZ = hours ? hours + " hrs " : "";
    dateTimeString = DAYZ + HOURZ + minutes + " mins";
  } else {
    dateTimeString = "Expired";
  }
  return dateTimeString;
};
const validURL = (str) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return pattern.test(str);
};
const stringToArray = (ITEM) => JSON.parse("[" + ITEM + "]");
const checkIsItInCart = (List, { _pid, _vid }) => {
  return List.length
    ? List.findIndex(({ product, variant }) => {
        const { _id: pid } = product;
        const { _id: vid } = variant;
        return _pid === pid && vid === _vid;
      })
    : -1;
};
const checkIsItInWishlist = (List, { _pid, _vid }) => {
  return List.length
    ? List.findIndex(({ product, variant }) => {
        const { _id: pid } = product;
        const { _id: vid } = variant;
        return _pid === pid && vid === _vid;
      })
    : -1;
};
const getMobileOperatingSystem = () => {
  let userAgent = navigator.userAgent || navigator.vendor || window.opera;
  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }

  return "unknown";
};
export {
  InfoLogger,
  WarningLogger,
  ErrorLogger,
  sorts,
  getMobileOperatingSystem,
  stringToArray,
  FilterMaker,
  phoneNumberValidator,
  EmailValidator,
  checkIsItInCart,
  checkIsItInWishlist,
  ExtractDateAndTime,
  timeLefter,
  OurTimeShower,
  OurTimeShower2,
};
