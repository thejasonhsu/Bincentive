var HC = {};
HC.templates = {};

HC.SETTINGS = {
}

Vue.options.delimiters = ['{[{', '}]}'];


/*=========================================================
 * HOME TEMPLATE
 *========================================================= */

HC.templates.home = new Vue({

  data: {
    currentTab: null
  },

  mounted: function() {
    // Set first category or section as current tab by default
    var firstTab = $(".nav-list").children(".nav-item").first();
    this.currentTab = $(firstTab).data("id");

    // Display nav content
    $(".nav-content-inner").removeClass('hide');
  },

  methods: {
    /**
     * Return true if given id matches current tab ID
     * @param  {integer}  id category or section ID
     * @return {Boolean}
     */
    isActive: function(id) {
      return id === this.currentTab;
    },

    /**
     * Sets current tab to given ID
     * @param {integer} id category or section
     */
    setTab: function(id) {
      this.currentTab = id;
    }
  }
});







/*
 * jQuery v1.9.1 included
 */

$(document).ready(function() {

  // social share popups
  $(".share a").click(function(e) {
    e.preventDefault();
    window.open(this.href, "", "height = 500, width = 500");
  });

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var $commentContainerTextarea = $(".comment-container textarea"),
    $commentContainerFormControls = $(".comment-form-controls, .comment-ccs");

  $commentContainerTextarea.one("focus", function() {
    $commentContainerFormControls.show();
  });

  if ($commentContainerTextarea.val() !== "") {
    $commentContainerFormControls.show();
  }

  // Expand Request comment form when Add to conversation is clicked
  var $showRequestCommentContainerTrigger = $(".request-container .comment-container .comment-show-container"),
    $requestCommentFields = $(".request-container .comment-container .comment-fields"),
    $requestCommentSubmit = $(".request-container .comment-container .request-submit-comment");

  $showRequestCommentContainerTrigger.on("click", function() {
    $showRequestCommentContainerTrigger.hide();
    $requestCommentFields.show();
    $requestCommentSubmit.show();
    $commentContainerTextarea.focus();
  });

  // Mark as solved button
  var $requestMarkAsSolvedButton = $(".request-container .mark-as-solved:not([data-disabled])"),
    $requestMarkAsSolvedCheckbox = $(".request-container .comment-container input[type=checkbox]"),
    $requestCommentSubmitButton = $(".request-container .comment-container input[type=submit]");

  $requestMarkAsSolvedButton.on("click", function() {
    $requestMarkAsSolvedCheckbox.attr("checked", true);
    $requestCommentSubmitButton.prop("disabled", true);
    $(this).attr("data-disabled", true).closest("form").submit();
  });

  // Change Mark as solved text according to whether comment is filled
  var $requestCommentTextarea = $(".request-container .comment-container textarea");

  $requestCommentTextarea.on("keyup", function() {
    if ($requestCommentTextarea.val() !== "") {
      $requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-and-submit-translation"));
      $requestCommentSubmitButton.prop("disabled", false);
    } else {
      $requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-translation"));
      $requestCommentSubmitButton.prop("disabled", true);
    }
  });

  // Disable submit button if textarea is empty
  if ($requestCommentTextarea.val() === "") {
    $requestCommentSubmitButton.prop("disabled", true);
  }

  // Submit requests filter form in the request list page
  $("#request-status-select, #request-organization-select")
    .on("change", function() {
      search();
    });

  // Submit requests filter form in the request list page
  $("#quick-search").on("keypress", function(e) {
    if (e.which === 13) {
      search();
    }
  });

  function search() {
    window.location.search = $.param({
      query: $("#quick-search").val(),
      status: $("#request-status-select").val(),
      organization_id: $("#request-organization-select").val()
    });
  }

  $(".header .icon-menu").on("click", function(e) {
    e.stopPropagation();
    var menu = document.getElementById("user-nav");
    var isExpanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", !isExpanded);
  });

  if ($("#user-nav").children().length === 0) {
    $(".header .icon-menu").hide();
  }

  // Submit organization form in the request page
  $("#request-organization select").on("change", function() {
    this.form.submit();
  });

  // Toggles expanded aria to collapsible elements
  $(".collapsible-nav, .collapsible-sidebar").on("click", function(e) {
    e.stopPropagation();
    var isExpanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", !isExpanded);
  });
});

$(document).ready(function(){

var hc_url = 'https://support.bincentive.com'

var _allarticles = [],
_sorted = [],
_artHtml = '',
_id,
_url;

var _articles = function(article){
$.ajax({
url: _url,
type: 'GET',
dataType: 'json',
success: article
});
};

// function for see all articles button in category
$('.see-all-articles').click(function(e){
e.preventDefault();
_id = $(e.target).attr('href').split('/sections/')[1].split('-')[0];

if(typeof HelpCenter.user.locale == 'undefined') {
HelpCenter.user.locale = window.location.pathname.replace('/', '').replace('?', '/').split('/')[1];
}

_url = hc_url+'/api/v2/help_center/'+HelpCenter.user.locale+'/sections/'+_id+'/articles.json';
_articles(function(data){
_allarticles = data.articles;

if(data.count>30){
for(var i = 1; i<data.page_count; i++){
_url = data.next_page;
_articles(function(data){
_allarticles = _allarticles.concat(data.articles);
_arthtml = '';
$(_allarticles).each(function(idx, itm){
if(itm.draft==true){
} else {
_arthtml = _arthtml + '<li class="'+(itm.promoted==true?'article-promoted':'')+'"><span data-title="Promoted article" style="'+(itm.promoted==false?'display:none':'')+'">★</span><a href="'+itm.html_url+'">'+itm.title+'</a></li>';
}
});
$(e.target).parent().find('ul.article-list').html(_arthtml);
$(e.target).hide();
})
}
} else {
_arthtml = '';
$(data.articles).each(function(idx, itm){
if(itm.draft==true){
} else {
_arthtml = _arthtml + '<li class="'+(itm.promoted==true?'article-promoted':'')+'"><span data-title="Promoted article" style="'+(itm.promoted==false?'display:none':'')+'">★</span><a href="'+itm.html_url+'">'+itm.title+'</a></li>';
}
});
$(e.target).parent().find('ul.article-list').html(_arthtml);
$(e.target).hide();
}

});
});
});