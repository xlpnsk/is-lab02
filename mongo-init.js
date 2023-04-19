db.getSiblingDB("admin").auth(
  process.env.MONGO_INITDB_ROOT_USERNAME,
  process.env.MONGO_INITDB_ROOT_PASSWORD
);
db = db.getSiblingDB("lab_db");
db.createUser({
  user: "lab_user",
  pwd: "lab_passwd",
  roles: [
    {
      role: "readWrite",
      db: "lab_db",
    },
  ],
});
db.createCollection("laptops", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "Laptop Object Validation",
      required: [
        "producent",
        "diagonal",
        "resolution",
        "surface",
        "touchable",
        "cpu",
        "cores",
        "mhz",
        "ram",
        "diskspace",
        "disktype",
        "gpu",
        "gpu_memory",
        "os",
        "drive",
      ],
      properties: {
        producent: {
          bsonType: "string",
          description: "'producent' must be a string and is required",
        },
        diagonal: {
          bsonType: "int",
          description: "'diagonal' must be an integer and is required",
        },
        resolution: {
          bsonType: "string",
          description: "'resolution' must be a string and is required",
        },
        surface: {
          enum: ["błyszcząca", "matowa", "błyszczący", "matowy"],
          description:
            "'surface' must be either błyszcząca, matowa, błyszczący, or matowy",
        },
        touchable: {
          bsonType: "bool",
          description: "'touchable' must be a boolean and is required",
        },
        cpu: {
          bsonType: "string",
          description: "'cpu' must be a string and is required",
        },
        cores: {
          bsonType: "int",
          description: "'cores' must be an integer and is required",
        },
        mhz: {
          bsonType: "int",
          description: "'mhz' must be an integer and is required",
        },
        ram: {
          bsonType: "string",
          description: "'ram' must be a string and is required",
        },
        diskspace: {
          bsonType: "string",
          description: "'diskspace' must be a string and is required",
        },
        disktype: {
          enum: ["SSD", "HDD"],
          description: "'disktype' must be either SSD or HDD",
        },
        gpu: {
          bsonType: "string",
          description: "'gpu' must be a string and is required",
        },
        gpu_memory: {
          bsonType: "string",
          description: "'gpu_memory' must be a string and is required",
        },
        os: {
          bsonType: "string",
          description: "'os' must be a string and is required",
        },
        drive: {
          bsonType: "string",
          description: "'drive' must be a string and is required",
        },
      },
    },
  },
});
