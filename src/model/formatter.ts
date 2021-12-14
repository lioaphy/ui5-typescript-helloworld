

export default {
  srcImageValue: function (bIsPhone: boolean) {
    var sImageSrc = "";
    if (bIsPhone === false) {
      sImageSrc = "./images/homeImage.jpg";
    } else {
      sImageSrc = "./images/homeImage_small.jpg";
    }
    return sImageSrc;
  }
}