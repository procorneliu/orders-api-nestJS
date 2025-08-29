import { NotFoundException } from '@nestjs/common';
import { QueryPaginationDto } from '../dtos/query-pagination.dto';

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;

export interface PaginateOutput<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    totalPerPage: number;
    prevPage: number | null;
    nextPage: number | null;
  };
}

const getPageAndSize = (query: QueryPaginationDto) => {
  const page = query.page ? Math.abs(parseInt(query.page)) : DEFAULT_PAGE_NUMBER;
  const size = query.size ? Math.abs(parseInt(query.size)) : DEFAULT_PAGE_SIZE;

  return [page, size];
};

export const paginate = (query: QueryPaginationDto): { skip: number; take: number } => {
  const [page, size] = getPageAndSize(query);
  return {
    skip: size * (page - 1),
    take: size,
  };
};

export const paginateOutput = <T>(data: T[], total: number, query: QueryPaginationDto): PaginateOutput<T> => {
  const [page, size] = getPageAndSize(query);

  const lastPage = Math.ceil(total / size);

  if (page > lastPage) {
    throw new NotFoundException(`Page ${page} not found.`);
  }

  if (!data.length) {
    return {
      data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        totalPerPage: size,
        prevPage: null,
        nextPage: null,
      },
    };
  }

  return {
    data,
    meta: {
      total,
      lastPage,
      currentPage: page,
      totalPerPage: size,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < lastPage ? page + 1 : null,
    },
  };
};
