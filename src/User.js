var User = (function() {
    var _id = "";
    var fullName = "";
    var roles = [];
  
    var getEmail = function() {
      _id = getCookie("id");
      return _id;
    };
  
    var setEmail = function(thisEmail) {
      _id = thisEmail;     
        document.cookie = "id="+thisEmail;
      // Also set this in cookie/localStorage
    };

    var getName = function() {
      fullName = getCookie("name");
      return fullName;
    }

    var setName = function(thisName) {
      fullName = thisName;
      document.cookie = "name="+thisName;
    }

    var getRoles = function() {
      roles = JSON.parse(getCookie("roles"));
      return roles;
    }

    var setRoles = function(theRoles) {
      roles = theRoles;
      document.cookie = "roles="+(JSON.stringify(theRoles));
    }

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
      getEmail: getEmail,
      setEmail: setEmail,
      getName: getName,
      setName: setName,
      getRoles: getRoles,
      setRoles: setRoles
    }
  
})();

export default User;