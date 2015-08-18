module.exports = {
  show: function(vocs){
    vocs = vocs ? vocs : [];

    var listHtml = '<ul>';
    
    for (var i = 0; i < vocs.length; i++) {
      var voc = vocs[i];
      listHtml += '<li><a href="/voc/' + voc.word + '">' + voc.word + ' - ' + voc.meaning + '</a></li>';
    }
    listHtml += '</ul>';
    return listHtml;
  }
}


/*
<ul>
    <% user.vocs.forEach(function(voc) { %>
        <li><a href="/voc/<%= voc.word %>"><%= voc.word %> - <%= voc.meaning %></a></li>
    <% }); %>
</ul>
*/