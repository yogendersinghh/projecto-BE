const { Docs } = require("../models/docs");
const { CNAME } = require("../models/cname");
const { DocumentUrl } = require("../models/documenationUrl");
const { sendResponse } = require("../utils/response");
const dns = require("dns");

async function checkCNAME(domain, cnameTarget) {
  return new Promise((resolve, reject) => {
    async function checkRecursivly() {
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            resolve({
              message: "we didn't find your subdomain CNmae in 5 minutes",
              status: false,
            });
          }, 20 * 60 * 1000); // 5 minutes in milliseconds
        });

        const addressesPromise = dns.promises.resolveCname(domain);

        const addresses = await Promise.race([
          addressesPromise,
          timeoutPromise,
        ]);
        if (addresses.includes(cnameTarget)) {
          resolve({
            message: `${domain} CNAME is pointing to ${cnameTarget}`,
            status: true,
          });
        } else {
          resolve({
            message: `The subdomain is pointing to another address ${addresses[0]}`,
            status: false,
          });
        }
      } catch (err) {
        console.log("🚀 ~ checkRecursivly ~ err:", err);
      }
    }
    checkRecursivly();
  });
}

const flattenSubPages = (subPages, parentUniqueId = null) => {
  let flattened = [];
  subPages.forEach((subPage) => {
    const {
      uniqueId,
      pageType,
      heading,
      title,
      subPages: nestedSubPages,
      referenceId,
    } = subPage;
    const isChildOfParent = referenceId === parentUniqueId;

    flattened.push({
      uniqueId,
      pageType,
      heading,
      title,
      isChildOfParent,
      referenceId,
    });

    if (nestedSubPages && nestedSubPages.length > 0) {
      flattened = flattened.concat(flattenSubPages(nestedSubPages, uniqueId));
    }
  });

  return flattened;
};

async function getSubPages(referenceId) {
  const pages = await Docs.find({ referenceId });
  if (pages.length === 0) {
    return [];
  }

  const result = [];
  for (const page of pages) {
    const subPages = await getSubPages(page.uniqueId);
    const pageWithSubPages = {
      ...page.toObject(),
      subPages,
    };
    result.push(pageWithSubPages);
  }

  return result;
}

module.exports.createPage = async (req, res) => {
  const data = req.body;
  if (!data.referenceId && !data.user) {
    return sendResponse(400, { message: "assigned user is needed" }, res);
  }
  try {
    const newPage = await Docs(data);
    await newPage.save();
    return sendResponse(200, { message: newPage }, res);
  } catch (err) {
    return sendResponse(500, { message: err }, res);
  }
};

module.exports.create = async (req, res) => {
  const data = req.body;
  // TODO:  add a documentID (documentId) when creating pages so when get the pages it should only render the specific data
  const mainPageData = { ...data };
  delete mainPageData.subPages;
  try {
    const subPageArray = flattenSubPages(data.subPages);
    const finalArray = [...subPageArray, mainPageData];
    await Docs.insertMany(finalArray);
    return sendResponse(
      200,
      { message: "Document is successfully uploaded" },
      res
    );
  } catch (err) {
    console.error("Error saving document:", err);
    return sendResponse(500, { message: err.message }, res);
  }
};

module.exports.mainDocument = async (req, res) => {
  const { userId, subDomain,title } = req.body;
  // TODO:  add a documentID (documentId) when creating pages so when get the pages it should only render the specific data
  if (!userId || !subDomain || !title) {
    return sendResponse(400, { message: "no user assign to this doc" });
  }
  try {
    const document = await DocumentUrl({ user: userId, subDomain,title });
    await document.save();
    return sendResponse(200, { message: document }, res);
  } catch (err) {
    return sendResponse(500, { message: err.message }, res);
  }
};

module.exports.read = async (req, res) => {
  const { userId, documentId, subDomain } = req.body;
  // TODO: add a documentID for getting pages only specific for particular documentation
  if (!userId || !documentId || !subDomain) {
    return sendResponse(
      400,
      { message: "Please provide all information" },
      res
    );
  }
  const docsData = await Docs.find({
    $and: [{ user: userId }, { documentId }, { subDomain }],
  });
  const finalResult = [...docsData];
  const subPagesArray = [];
  for (let [index, val] of docsData.entries()) {
    const returnedData = await getSubPages(val.uniqueId);
    finalResult[index] = { ...finalResult[index]._doc, subPages: returnedData };
    subPagesArray.push(returnedData);
  }

  try {
    return sendResponse(200, { message: finalResult }, res);
  } catch (err) {
    console.error("Error saving document:", err);
    return sendResponse(500, { message: err.message }, res);
  }
};

module.exports.removePage = async (req, res) => {
  const { uniqueId } = req.body;
  try {
    const data = await Docs.findOneAndDelete({ uniqueId });
    return sendResponse(200, { message: data }, res);
  } catch (err) {
    console.error("Error saving document:", err);
    return sendResponse(500, { message: err.message }, res);
  }
};

module.exports.editPage = async (req, res) => {
  const updatedData = req.body;
  try {
    const data = await Docs.findOneAndUpdate(
      { uniqueId: updatedData.uniqueId },
      { $set: { ...updatedData } },
      { new: true }
    );
    return sendResponse(200, { message: data }, res);
  } catch (err) {
    console.error("Error saving document:", err);
    return sendResponse(500, { message: err.message }, res);
  }
};

module.exports.searchTitle = async (req, res) => {
  const { title } = req.body;
  try {
    const data = await Docs.find({ title: { $regex: title } });
    return sendResponse(200, { message: data }, res);
  } catch (err) {
    console.error("Error saving document:", err);
    return sendResponse(500, { message: err.message }, res);
  }
};

module.exports.saveCname = async (req, res) => {
  const { cnameTarget, subDomain, userId, documentId } = req.body;
  const cnameResponse = await checkCNAME(subDomain, cnameTarget);
  if (!cnameResponse.status) {
    return sendResponse(400, { message: cnameResponse.message }, res);
  }
  const data = await CNAME({
    cnameTarget,
    subDomain,
    userId,
    documentId,
  });
  await data.save();
  return sendResponse(200, { message: cnameResponse.message }, res);
};

module.exports.docList = async (req, res) => {
  const { userId, subDomain, limit=10, page=1 } = req.body;
  const offset = limit * (page - 1);
  try {
    if( !userId || !subDomain){
      return sendResponse(400, { message: "Please provide all information" }, res); 
    }
    const documents = await DocumentUrl.paginate(
      { user: userId, subDomain },
      {
        offset,
        limit,
      }
    ); 
    return sendResponse(200, { message: documents }, res); 
  } catch (err) {
    return sendResponse(500, { message: err.message }, res);
  }
};

module.exports.deleteDoc = async (req, res) => {
  const {id} = req.body;
  try {
    if( !id){
      return sendResponse(400, { message: "document id is required" }, res); 
    }
    const documents = await DocumentUrl.findByIdAndDelete(id)
    return sendResponse(200, { message: documents }, res); 
  } catch (err) {
    return sendResponse(500, { message: err.message }, res);
  }
};

