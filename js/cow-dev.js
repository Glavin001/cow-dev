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
