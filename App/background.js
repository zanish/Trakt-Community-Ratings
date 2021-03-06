chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  if (request.action == "xhttp") {
      var xhttp = new XMLHttpRequest();
      var method = request.method ? request.method.toUpperCase() : 'GET';

      xhttp.onload = function() {
          callback(xhttp.responseText);
      };
      xhttp.onerror = function() {
          // Do whatever you want on error. Don't forget to invoke the
          // callback to clean up the communication port.
          callback();
      };
      xhttp.open(method, request.url, true);
      if (method == 'POST') {
          xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      }
      xhttp.send(request.data);
      return true; // prevents the callback from being called too early on return
    }
  if(request.action == "ajax") {
    var xhttp = new XMLHttpRequest();
    var method = request.method ? request.method.toUpperCase() : 'GET';

    xhttp.onreadystatechange = function() {
      if(xhttp.readyState == 4 && xhttp.status == 200) {
        callback(xhttp.response);
      }
    }
    xhttp.onerror = function() {
        // Do whatever you want on error. Don't forget to invoke the
        // callback to clean up the communication port.
        callback();
    };
    xhttp.open(method, request.url, true);
    if (method == 'POST') {
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    xhttp.send();
    return true; // prevents the callback from being called too early on return
  }
});
