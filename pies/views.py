from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return HttpResponse("""
    <form class="form-horizontal">
<fieldset>

<!-- Form Name -->
<legend>Order Your Beta Theta Pie</legend>

<!-- Text input-->
<div class="form-group">
  <label class="col-md-4 control-label" for="nameinput">Name</label>  
  <div class="col-md-4">
  <input id="nameinput" name="nameinput" type="text" placeholder="" class="form-control input-md" required="">
    
  </div>
</div>

<!-- Appended Input-->
<div class="form-group">
  <label class="col-md-4 control-label" for="emailinput">Email</label>
  <div class="col-md-4">
    <div class="input-group">
      <input id="emailinput" name="emailinput" class="form-control" placeholder="" type="text" required="">
      <span class="input-group-addon">@wpi.edu</span>
    </div>
    
  </div>
</div>
<!-- Multiple Checkboxes -->
<div class="form-group">
  <label class="col-md-4 control-label" for="toppingsinput">Toppings</label>
  <div class="col-md-4">
  <div class="checkbox">
    <label for="toppingsinput-0">
      <input type="checkbox" name="toppingsinput" id="toppingsinput-0" value="1">
      Pepperoni
    </label>
    </div>
  <div class="checkbox">
    <label for="toppingsinput-1">
      <input type="checkbox" name="toppingsinput" id="toppingsinput-1" value="2">
      Mushrooms
    </label>
    </div>
  <div class="checkbox">
    <label for="toppingsinput-2">
      <input type="checkbox" name="toppingsinput" id="toppingsinput-2" value="4">
      Bacon
    </label>
    </div>
  <div class="checkbox">
    <label for="toppingsinput-3">
      <input type="checkbox" name="toppingsinput" id="toppingsinput-3" value="8">
      Onion
    </label>
    </div>
  <div class="checkbox">
    <label for="toppingsinput-4">
      <input type="checkbox" name="toppingsinput" id="toppingsinput-4" value="16">
      Olives
    </label>
    </div>
  <div class="checkbox">
    <label for="toppingsinput-5">
      <input type="checkbox" name="toppingsinput" id="toppingsinput-5" value="32">
      Pineapple
    </label>
    </div>
  </div>
</div>

<!-- Select Basic -->
<div class="form-group">
  <label class="col-md-4 control-label" for="selectbasic">Select Basic</label>
  <div class="col-md-4">
    <select id="selectbasic" name="selectbasic" class="form-control">
      <option value="1">Option one</option>
      <option value="2">Option two</option>
    </select>
  </div>
</div>

</fieldset>
</form>

    """)

# Create your views here.
