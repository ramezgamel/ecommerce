module.exports = class ApiFeature {
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams;
  }
  sort() {
    if (this.queryParams.sort) {
      const sortBy = this.queryParams.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  filter() {
    const queryString = { ...this.queryParams };
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"];
    excludesFields.forEach((field) => delete queryString[field]);
    this.query = this.query.find(queryString);
    return this;
  }
  fields() {
    if (this.queryParams.fields) {
      const fields = this.queryParams.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  paginate() {
    const page = this.queryParams.page * 1 || 1;
    const limit = this.queryParams.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
  search() {
    if (this.queryParams.keyword) {
      const re = new RegExp(this.queryParams.keyword, "i");
      const search = {
        $or: [
          { name: { $regex: re, $options: "i" } },
          { title: { $regex: re, $options: "i" } },
        ],
      };
      this.query = this.query.find(search);
    }
    return this;
  }
};
