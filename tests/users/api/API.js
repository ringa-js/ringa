class API {
  getUsers() {
    return new Promise(function(resolve) {
      setTimeout(() => resolve([
        {firstName: 'Josh', lastName: 'Jung'},
        {firstName: 'Thomas', lastName: 'Yarnall'},
        {firstName: 'Alexander', lastName: 'Selling'}
      ]), 10);
    });
  }
}

export default API;
