export const server_domain = "https://agrixchange.blueboxonline.com/?api";
export const apikey = "oo568bc6fd9hp3WcE7Ui0244d1boadre";
export const apisecret = "vv36ebali44";
// export const token = "dff0197768ba6725a346769fb485f46f"

export const getFormServer = () => {
  let formData = new URLSearchParams();
  formData.append("apikey", apikey);
  formData.append("apisecret", apisecret);

  return formData;
};

export const getFormClient = () => {
  let formData = new FormData();
  formData.append("apikey", apikey);
  formData.append("apisecret", apisecret);

  return formData;
};

export const seasonOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
