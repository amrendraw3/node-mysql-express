var commonMethods = {};

commonMethods.timeDiffCalc = (expireTime) => {
    var endDate = new Date();
    var startDate = new Date(expireTime);
    var timeDiff = Math.abs(endDate - startDate);

    // calculate hours
    const hours = timeDiff / 36e5;
    console.log('calculated hours', hours);

    // calculate minutes
    const minutes = Math.round((timeDiff / 1000) / 60);
    console.log('minutes', minutes);

    return {
      hours,
      minutes
    }
}

commonMethods.getCurrentTime = () => {
    return (new Date()).getTime();
}

module.exports = commonMethods;