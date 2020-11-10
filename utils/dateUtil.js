module.exports = {
  isValidDateString: (dateString) => {
    const d = new Date(dateString);
    return !isNaN(d.getTime());
  }
}