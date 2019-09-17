let buttons = ['Monkeys', 'Dogs', 'Kittens', 'Tigers', 'Lions']; //Initial value and objects
const API_KEY = 'MgwflFY3uJycuTCUpzJQJsiuV6wHAGA9&limit=10'
const endpoint = 'https://api.giphy.com/v1/gifs/search?api_key=' + API_KEY;

// function loadButtons() {
//     const listButtons = JSON.parse(localStorage.getItem('buttons'));
//      buttons = listButtons;
// };


function renderButtons() {

    $('.recent-search').empty();

    for (let i = 0; i < buttons.length; i++) {
        const buttonName = buttons[i];

        const button = `
            <div class="wrap-buttons">
                <button 
                class="btn btn-search"
                data-name="${buttonName}"
                >${buttonName}
            </button>
            <button
                data-name="${buttonName}"
                data-index="${i}"
                class="btn btn-delete fas fa-times"
            ></button>
        </div>`;
        $('.recent-search').append(button);
    }
    // localStorage.setItem('buttons', JSON.stringify(buttons));
}

function removeButton() {

    const buttonIndex = $(this).attr('data-name');        //We are getting each buttons selected seperatly and deleted

    buttons.splice(buttonIndex, 1);

    console.log('Buttons: ', buttons);

    renderButtons();

    console.log('button Name: ', buttonIndex);
}

function addButton(value) {
    buttons.push(value);

    renderButtons();
}

function createGiphyTemplate(giphy) {
    const images = giphy.images;
    const template = `
    <div class="giphy">
    <div class="giphy-image">
        <img 
        src="${images.original_still.url}" 
        data-still="${images.original_still.url}" 
        data-animate="${images.original.url}" 
        data-state="still">
        </div>
     <div class="giphy-info">
        <p>Rating: g</p>
          </div>
  
     <div class="giphy-footer" data-link="${giphy.embed_url}"> 
         </div>
         </div>
         `;

    return template;
}

function renderGiphys(giphys) {

    $('.giphy-content').empty();

    for (let i = 0; i < giphys.length; i++) {
        const giphy = giphys[i];
        const giphyTemplate = createGiphyTemplate(giphy);

        $('.giphy-content').append(giphyTemplate);
    }
}

function fetchGiphy(value) {
    const url = endpoint + '&q=' + value;
    $.ajax({
        url,
        method: "GET"
    }).then(function (response) {
        giphys = response.data;

        renderGiphys(giphys);
        console.log('Giphys: ', giphys);

    })
        .catch(function (error) {
            console.log('Error: ', error);
        });
}

function searchGiphy(event) {
    console.log('search giphy function has started')
    event.preventDefault();

    const value = $('#search').val();
    if (buttons.includes(value)) {
        alert('this is already added!')
    } else {
        addButton(value)
    }
    $('#search').val(''); //reset val
    console.log('seach giphy function complete')

}

function imgCardClick() {
    const giphyCard = $(this);

    const img = giphyCard.find('img');
    // const icon = giphyCard.find('i');

    const still = img.attr('data-still');
    const animate = img.attr('data-animate');
    const state = img.attr('data-state');

    if (state === 'still') {
        img.attr("src", animate)
            .attr("data-state", "animate");

    } else {
        img.attr("src", still)
            .attr("data-state", "still");
    }
}


function clipToClipBoard(value) {
    const tempElement = $('<input>');
    $('body').append(tempElement);

    tempElement.val(value).select();
    document.execCommand('copy');
    tempElement.remove();
}


function copyLink() {
    const link = $(this).attr('data-link');
    const content = $(this).html();

    clipToClipBoard(link);

    $(this).html('copied!!!');

    setTimeout(() => $(this).html(content), 3000);


}

function searchGiphyByButton() {
    const buttonName = $(this).attr('data-name');
    const parent = $(this).parent();

    $('.btn').parent().removeClass('active');
    parent.addClass('active');

    fetchGiphy(buttonName);
}


function clearResult(event) {
    event.preventDefault();

    $('.btn').parent().removeClass('active');
    $('.giphy-content').html('<p>The resul has been creared!</p>');
}

function generateRandomValue(arr) {
    if (arr.length > 0) {
        const index = Math.floor(Math.random() * arr.length);
        const value = arr[index];
        return value;
    }
    return 'developer';
}


function disableSearchButton() {
    const value = $(this).val();

    if (value) {
        $('#submit-button').prop('disabled', false);
    } else {
        $('#submit-button').prop('disabled', true);
    }
}


function inputApp() {

    const value = generateRandomValue(buttons);
    // loadButtons();
    renderButtons();
    fetchGiphy(value);
}

inputApp();

//EVENTS
$(document).on('click', '.btn-delete', removeButton);  //With this function gets deleted
$(document).on('click', '.giphy-image', imgCardClick);
$(document).on('click', '.giphy-footer', copyLink);
$(document).on('click', '.btn-search', searchGiphyByButton);

// $(document).on('click', '.giphy-image', function(){  
//});
$('#submit-button').on('click', searchGiphy);
$('#clear-result').on('click', clearResult);
$('#search').on('keyup', disableSearchButton);