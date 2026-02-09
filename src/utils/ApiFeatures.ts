import { Model, Document, FilterQuery } from "mongoose";

interface QueryObj {
  [key: string]: any;
}

class ApiFeatures<T extends Document> {
  query: any;
  queryString: QueryObj;

  constructor(query: Model<T>, queryString: QueryObj) {
    this.query = query;
    this.queryString = queryString;
  }

  // فلترة
  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // تحويل قيم true/false للنوع Boolean
    Object.keys(queryObj).forEach((key) => {
      if (queryObj[key] === "true") queryObj[key] = true;
      if (queryObj[key] === "false") queryObj[key] = false;
    });

    this.query = this.query.find(queryObj);
    return this;
  }

  // ترتيب
  sort() {
    if (this.queryString.sort) {
      const sortBy = (this.queryString.sort as string).split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // افتراضي
    }
    return this;
  }

  // pagination
  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default ApiFeatures;
