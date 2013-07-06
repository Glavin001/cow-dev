/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var loadRun = function() {
  console.log("loadRun");

  var dstFrame = document.getElementById('cow-html-render');
  var dstDoc = dstFrame.contentDocument || dstFrame.contentWindow.document;
  dstDoc.write(editor.doc.getValue());
  dstDoc.close();
};

$('a[href="#cow-view-tab"]').on('show', function () {
  console.log('click : #cow-view-tab');
  
  loadRun();
});

$('#roomButton').on('click', function() {
	console.log('click');
	var roomTitle = $('#roomInput').val();
	document.location.href = "edit.html#" + roomTitle;
	return false; 
});

$('#cow-lang-web').on('click', function() {
	console.log("lang : web");
});

$('#cow-lang-python').on('click', function() {
	console.log("lang : python");
});

$('#cow-lang-java').on('click', function() {
	console.log("lang : java");
});