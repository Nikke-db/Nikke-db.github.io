import fs from "node:fs"

const gallery = process.argv[2]
const notice = process.argv[3]
const title = process.argv[4]

if (!gallery || notice === undefined) {
  console.error("ERROR, MISSING GALLERY OR NOTICE ARGUMENT")
  process.exit()
} else {
  console.log(`CREATING A GALLERY FILE FOR GALLERY ${gallery} WITH NOTICE ${notice}`)
}

/*
interfaces from the vue project

interface galleryItemInterface {
  name: string,
  text: string
}

interface galleryInterface {
  path: string,
  type: string,
  title: string,
  id: string,
  content: galleryItemInterface[],
  notice: string | null
}
*/

class GalleryItem {
  name = null
  text = null

  constructor(name) {
    this.name = name
  }

  buildForJson() {
    return {
      "name": this.name,
      "text": this.text
    }
  }
}

class Gallery {
  path = null
  type = "large"
  id = null
  title = null
  content = []
  notice = null
  
  constructor(galleryName, notice, title) {
    this.path = `${galleryName}/`
    this.id = galleryName
    this.notice = notice
    this.setTitle(title)
  }

  // add a new gallery item entry
  addItem(name, text) {
    this.content.push(new GalleryItem(name))
  }

  // reorder the list, always put in first the "Event" files
  reorderContent() {
    this.content.sort((a,b) => {
      if (a.name.startsWith("Event") && !b.name.startsWith("Event")) return -1
      if (!a.name.startsWith("Event") && b.name.startsWith("Event")) return 1

      return [a,b].sort()
    })

    this.content.forEach((f, i) => {
      f.text = this.title + " " + (i + 1)
    })
  }

  buildForJson() {
    const filesJson = []
    this.content.forEach((c) => {
      filesJson.push(c.buildForJson())
    })

    const json = {
      "path": this.path,
      "type": this.type,
      "id": this.id,
      "title": this.title,
      "notice": this.notice,
      "content" : filesJson
    }

    if (notice === "") {
      delete json.notice
    }

    return json
  }

  setTitle(title) {
    if (title) {
      this.title = title
    } else {
      this.title = this.id.toUpperCase()
    }
  }
}

const folder = `images/gallery/${gallery}`

fs.readdir(folder, (err, files) => {
  if (err) {
    console.log(err)
    process.exit()
  }
  const fullGallery = new Gallery(gallery, notice, title)

  files.forEach((f, i) => {
    fullGallery.addItem(f, i+1)
  })

  fullGallery.reorderContent()

  fs.writeFile("./gallery_output.json", JSON.stringify(fullGallery.buildForJson()), {}, (err) => {
      if (err) console.log(err)
  })

})
