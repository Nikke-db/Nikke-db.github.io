"use strict";

const content = document.getElementById("content");
let i = 0;

const main = async () => {

    const response_story = await fetch('./js/json/story_no_caller_id.json');
    const json_story = await response_story.json();

    let old_chapter = "";
    let old_name = "";

    json_story.forEach(json => {

        if (json.chapter !== old_chapter){
            i++;
            createChapter();
            old_chapter = json.chapter;
        }

        const div = document.createElement("div");
        div.classList.add("dialogue")
        const img = document.createElement('img');
        img.src = "./images/sprite/si_"+json.id+"_00_s.png";

        json.name === "Self" ? json.name = "Commander" : true;

        if (json.name.toLowerCase() === "choice"){
            let content="";

            json.content.map((choice)=>{
                content += "> " + choice +"<br/>"
            })

            div.innerHTML = "<span class='subdialogue'><span>"+json.name.charAt(0).toUpperCase()+json.name.slice(1)+"</span><br/><span>" +content + "</span></span>";
        }else{
            div.innerHTML = "<span class='subdialogue'><span>"+json.name.charAt(0).toUpperCase()+json.name.slice(1)+"</span><br/><span>" +json.content + "</span></span>";
        }
        div.prepend(img);
        content.append(div);

        // <div>
        //     <img/>
        //     <span class="subdialogue">
        //         <span> Char Name </span><br/>
        //         <span> content </span>
        //     </span>
        // </div>

    });
}

const createChapter = () => {

    const h1 = document.createElement("h1");
    h1.innerHTML = "Chapter " + i;
    content.append(h1)
}

document.querySelector(".no-caller-id").addEventListener("click", (e) => {
    main()
})