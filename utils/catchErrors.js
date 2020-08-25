const catchErrors = (err, displayError) => {
  let errMsg;
  if (err.response) {
    //this means request was made and the server responded
    //with status code outside 2XX
    errMsg = err.response.data;
    console.error("Failed", errMsg);
    //For cloudinary image uploads
    if (err.response.data.error) {
      errMsg = err.response.data.error.message;
    }
  } else if (err.request) {
    //request was made but no response
    errMsg = err.request;
    console.error("Failed", errMsg);
  } else {
    //something else happened

    errMsg = err.message;
    console.error("Failed", errMsg);
  }

  displayError(errMsg);
};

export default catchErrors;
