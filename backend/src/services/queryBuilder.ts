import { FilterQuery, Query } from 'mongoose';

export class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public query: Record<string, any>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, any>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    filter() {
        const queryObj = { ...this.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields', 'order', 'search'];
        excludeFields.forEach((el) => delete queryObj[el]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.modelQuery = this.modelQuery.find(JSON.parse(queryStr) as FilterQuery<T>);
        return this;
    }

    search(searchableFields: string[]) {
        if (this.query.search) {
            const searchTerm = this.query.search as string;
            const searchQuery = {
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: 'i' },
                })),
            };
            this.modelQuery = this.modelQuery.find(searchQuery as FilterQuery<T>);
        }
        return this;
    }

    sort() {
        if (this.query.sort) {
            const sortBy = (this.query.sort as string).split(',').join(' ');
            const order = this.query.order === 'desc' ? '-' : '';
            this.modelQuery = this.modelQuery.sort(`${order}${sortBy}`);
        } else {
            this.modelQuery = this.modelQuery.sort('-createdAt');
        }
        return this;
    }

    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;

        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    limitFields() {
        if (this.query.fields) {
            const fields = (this.query.fields as string).split(',').join(' ');
            this.modelQuery = this.modelQuery.select(fields);
        } else {
            this.modelQuery = this.modelQuery.select('-__v');
        }
        return this;
    }
}
