---
lang-ref: data
title: Data
description: We publish open data
layout: occurrence
---
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

<div id="specimenDiv">
    <button id="requestIds" class="button is-primary" onclick="getIds(this.id)" disabled>Request specimens</button>
    <button id="copyIds" class="button is-primary" onclick="getIds(this.id)">Copy occurrence IDs to clipboard</button>
</div>

<script>
let filter;
window.onload = (event) => {
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        onUrlChange();
      }
    }).observe(document, {subtree: true, childList: true});
    onUrlChange();
};

function onUrlChange() {
  updateGetIdButtons();
}
</script>