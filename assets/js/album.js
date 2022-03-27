$(document).ready(function() {
  $("#add-fields").click(function(){
    let num_fields = parseInt($("#member").val())
    $("#custom-terms").empty()
    let i = 0
    while(i < num_fields){
      $("#custom-terms").append(
        "<label for=\"text-search\">Custom Field "+i+": </label> <input type=\"text\" id=\"field-"+i+"\" name=\"text-search\"><br>"
      )
      i=i+1

    }
      console.log(i)

  })
  $(window).keydown(function(event){
    if( (event.keyCode == 13) ){
      event.preventDefault();
      return false;
    }
  })
  //Citation: https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = error => reject(error);
    });
  }
 
  $("#submit-photo").click(function(){
    var file = $('#myFile')[0].files[0]
    if (file){
      console.log(file.name);
    }
    let data = getBase64(file).then(data =>{
    console.log(data)
    let ct = file.type
    let labels = []
    $('#custom-terms').children('input').each(function () {
      labels.push(this.value) // "this" is the current element in the loop
    });
    console.log(labels)
    let header = { "x-api-key":"3IszdTNj939DnB7Gfet8v9dQMaTj6taDazpZWXwV","Content-Type": 'garbage', "filename" : file.name, "x-amz-meta-customLabels": labels}
    sdk.uploadPut(header,data,{}).then((response) => {
      if(response.status == 200){
        alert("Photo uploaded successfully!")
      }
      else{
        alert("Photo upload not successful")
      }
      console.log(response);})
  
    })
    
 
  })
  $("#mic-icon").click(function(){
    $("#mic-icon").addClass("filter")
    startRecognition()
    
  })
  $("#submit-search").click(function(){
    let q = $("#text-search").val()
    sdk.searchGet({"q":q},{},{}).then((response)=>{
      console.log(response)
      let results = response.data.results
      $("#search-results").empty()
      $("#hits").empty()
      $("#hits").append("<h3>"+results.length+" results for: \""+q+"\"<h3><br>")
      $.each(results, function(key, value) {
        $("#search-results").append(
          "<div class=\"col-md-4\"> <img class = \"img-fluid\" src=\""+value.url+"\"></div>"
        )
        console.log(value)
        
      });
    })
  })
  

});

//Citaton: https://codepen.io/rebelchris/pen/VwKKgPE
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const status = document.getElementById("status"),
  output = document.getElementById("result");

startRecognition = () => {
  if (SpeechRecognition !== undefined) {
    let recognition = new SpeechRecognition();

    recognition.onstart = () => {
    //fill in later
    };

    recognition.onspeechend = () => {
      //fill in later
      recognition.stop();
      $("#mic-icon").removeClass("filter")
    };

    recognition.onresult = (result) => {
      $("#text-search").val( result.results[0][0].transcript)
      console.log(result.results[0][0].transcript)
    };

    recognition.start();
  } else {
   //fill in later
  }
};
