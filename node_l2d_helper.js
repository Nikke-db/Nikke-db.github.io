// helper that take 1 arg being the cid of a character
// will move l2d files into the corresponding aim/cover folders
// will detect if a file is supposed to be a skin and will rename it as needed to being used by the website

const fs = require("node:fs")

const cid = process.argv[2]

if (cid === undefined)  {
  console.log('no argv 2 given')
  process.exit()
}

const folder = `l2d/${cid}`

fs.readdir(folder, (err, files) => {
  if (err) { 
    console.log(err)
    process.exit()
  }
  
  // read file by file
  // step 1 : detect if it's a png, if yes skip to step 3
  // step 2 : detect if it's a skin (no _00 suffix), if yes rename the file
  // step 3 : move the file to the correctif folder

  files.forEach((f) => {
    if (!f.includes('.png')) {
      const splittedName = f.split('.')
      if (!splittedName[0].endsWith("_00")) {
        // how to rename file 
        
        const splittedName2 = f.split('_')
        let stitchedName = [splittedName2[0], splittedName2[splittedName2.length - 1].split(".")[0]].join("_") // keep cid + skin id. remove file extension
        if (splittedName2.length === 3) { //handle aim and cover
          stitchedName = [stitchedName, splittedName2[1]].join("_")
        }
        stitchedName = [stitchedName, "00." + splittedName[1]].join("_") // add _00 id and file extension
        
        fs.renameSync([folder, f].join('/'), [folder, stitchedName].join('/'))
        moveFile(stitchedName)
      } else {
        moveFile(f)
      }
    } else {
      moveFile(f)
    }
    
  })
  
})


const moveFile = (file) => {
  let destinationFolder = null
  if (file.includes("aim")) destinationFolder = "aim"
  if (file.includes("cover")) destinationFolder = "cover"

  if (destinationFolder === null) return // full body files : do nothing

  const fullDestination = [folder, destinationFolder].join('/')

  if (!fs.existsSync(fullDestination)) {
    fs.mkdirSync(fullDestination)
  }

  fs.copyFileSync([folder, file].join('/'), [fullDestination, file].join('/'))
  fs.rmSync([folder, file].join('/'))

}