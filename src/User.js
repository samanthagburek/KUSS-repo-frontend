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
      try {
        const roleVals = getCookie("roles");
        roles = roleVals ? JSON.parse(roleVals) : [];
      } catch (e) {
        roles = [];
      }
      return roles;
    }

    var setRoles = function(theRoles) {
      roles = theRoles;
      document.cookie = "roles="+(JSON.stringify(theRoles));
    }
    var getAffiliation = function() {
      return getCookie("affiliation");
    };

    var setAffiliation = function(aff) {
      document.cookie = "affiliation=" + aff;
    }

    var clear = function() {
      document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "roles=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "affiliation=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
      setRoles: setRoles,
      getAffiliation: getAffiliation,
      setAffiliation: setAffiliation,
      clear: clear
    }
  
})();

export default User;