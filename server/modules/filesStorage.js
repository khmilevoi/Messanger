const fs = require("fs");

class FilesStorage {
  constructor() {
    this.files = new Object();

    this.path = "./Files/";

    this.readFiles();
  }

  watch() {
    this.timerid = setInterval(async () => {
      await this.readFiles();

      this.printStat();
    }, 5000);

    return () => {
      clearInterval(this.timerid);

      delete this.timerid;
    };
  }

  readFiles() {
    return new Promise((resolve, reject) => {
      this.files = new Object();

      fs.readdir(this.path, (err, files) => {
        if (err) {
          reject(err);
        }

        files.forEach(async val => {
          const splited = val.split(".");

          const postfix = splited[splited.length - 1];

          splited.splice(splited.length - 1, 1);

          const name = splited.join(".");

          if (typeof this.getFiles(name) !== "undefined" && this.getFiles(name) !== val) {
            await this.removeFile(name, postfix);
          } else {
            this.files[name] = val;
          }
        });

        resolve(this.files);
      });
    });
  }

  getFiles(name, withNull = false) {
    if (withNull) {
      return this.files[name] ? this.files[name] : null;
    }

    return this.files[name];
  }

  async removeFile(name, postfix) {
    if (typeof postfix == "undefined") {
      await fs.unlink(this.path + this.files[name], err => {
        if (err) console.log(err);
      });

      delete this.files[name];
    } else {
      await fs.unlink(this.path + `${name}.${postfix}`, err => {
        if (err) console.log(err);
      });
    }
  }

  async addFile(name, postfix, data) {
    if (typeof this.getFiles(name) !== "undefined") {
      await this.removeFile(name);
    }

    const fileName = `${name}.${postfix}`;

    const file = data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(file, "base64");

    fs.writeFile(this.path + fileName, buffer, err => {
      if (err) console.log(err);
    });

    this.files[name] = fileName;
  }

  printStat() {
    console.log("============================ FILE STORAGE ============================");

    console.log(`PATH: ${this.path}`);
    console.log("FILES:");
    console.table(this.files);
    if (this.timerid) {
      console.log("WATCHED");
    }

    console.log("======================================================================");
  }
}

module.exports = new FilesStorage();
