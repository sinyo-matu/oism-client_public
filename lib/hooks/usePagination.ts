import React, { useEffect, useRef } from 'react'
import { useInfiniteQuery } from 'react-query';
import { PagedResponse } from '../../type';
import { privateApiCall } from '../utility';
import { useHeightScrollPercentage } from './useHeightScrollPercentage';
interface Props{
    params:string,
    intervalByMs:number
}

export const usePagination = <D>({params,intervalByMs}:Props) => {
  const fetcher = async ({pageParam=0})=>{
    const response = await privateApiCall<PagedResponse<D>>(`/registers?${params}&page=${pageParam}`, "GET").catch(
      (err) => {
        console.log(err);
      }
    );
    if(!response) throw Error("can not get orders");
    return response
  };
const {
        isError,
        hasNextPage,
        error,
        data,
        fetchNextPage,
        isFetching,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery(['orders',params], fetcher, {
        getNextPageParam: (lastPage) => {
            if (!lastPage.hasNext) return undefined
            return lastPage.next
        },
    })
    const heightScrollPercentage = useHeightScrollPercentage(intervalByMs);
    const fetchRef = useRef(fetchNextPage);
    const isFetchingRef = useRef<boolean>();
    isFetchingRef.current = isFetchingNextPage
    const hasNextPageRef = useRef<boolean>();
    hasNextPageRef.current= hasNextPage;
    useEffect(() => {
      console.log(heightScrollPercentage);
        if(heightScrollPercentage>=85 && !(isFetchingRef.current||!hasNextPageRef.current)){
            fetchRef.current()
        }
    }, [heightScrollPercentage])
  return {hasNextPage,error,data,isFetching,isFetchingNextPage,refetch}
}
