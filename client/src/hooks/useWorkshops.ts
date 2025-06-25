import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workshopApi, registrationApi } from '../utils/api';

export const useWorkshops = () => {
  return useQuery({
    queryKey: ['workshops'],
    queryFn: workshopApi.getAll,
  });
};

export const useWorkshop = (id: number) => {
  return useQuery({
    queryKey: ['workshop', id],
    queryFn: () => workshopApi.getById(id),
    enabled: !!id,
  });
};

export const useMyRegistrations = () => {
  return useQuery({
    queryKey: ['my-registrations'],
    queryFn: registrationApi.getMy,
  });
};

export const useRegisterForWorkshop = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: registrationApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
    },
  });
};