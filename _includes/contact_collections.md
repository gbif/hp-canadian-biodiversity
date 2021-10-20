

<script>
function handleClick(recipient) {
  var body = encodeURIComponent(document.getElementById("msg").value);
  if (body != "") {
    var link =
      "mailto:" +
      recipient+
      "?cc=myCCaddress@example.com" +
      "&subject=" +
      encodeURIComponent("Information Request from Hosted-Portal!") +
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