---
permalink: /en/collections/dao
lang-ref: dao
title: National Collection of Vascular Plants (DAO)
description:
background: assets/images/christopher-lozano-QehxpJJHcIc-unsplash.jpg
imageLicense: |
  Photo by [Christopher Lozano]("https://unsplash.com/@clozano84?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText") on [Unsplash]("https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText")
height: 70vh
layout: compose
contacts:
 - name: Contact A
   email: contactA@example.com
 - name: Contact B
   email: contactB@example.com
composition:
 - type: heroImage
 - type: markdown
   data: dao.intro
 - type: markdown
   data: dao.search
 - type: pageMarkdown

---
## Contact us

<script>
function handleClick(recipient) {
  var body = encodeURIComponent(document.getElementById("msg").value);
  if (body != "") {
    var link =
      "mailto:" +
      recipient+
      "?cc=myCCaddress@example.com" +
      "&subject=" +
      encodeURIComponent("CNC Information Request from Hosted-Portal!") +
      "&body=" +
      body;
    window.location.href = link;
  }
}
</script>

<div>
  <textarea id="msg" name="msg" class="email-textarea"></textarea>
  {% assign class_name = "button is-primary" %}
  {% for contact in page.contacts %}
    <button class="{{class_name}}" value="{{contact.email}}" onclick="handleClick(this.value)">{{ contact.name }}</button>
    {% assign class_name = "button" %}
  {% endfor %}
</div>
