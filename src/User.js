var User = (function() {
    var _id = "";
    //var roles = [];
  
    var getName = function() {
      _id = getCookie("id");
      return _id;
    };
  
    var setName = function(thisName) {
      _id = thisName;     
        document.cookie = "id="+thisName;
      // Also set this in cookie/localStorage
    };

    function getCookie(cname) {
      let name = cname + "=";
      let ca = document.cookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }
  
    return {
      getName: getName,
      setName: setName
    }
  
})();

export default User;