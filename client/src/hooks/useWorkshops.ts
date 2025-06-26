import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workshopApi, registrationApi } from '../utils/api';

export const useWorkshops = () => {
  return useQuery({
    queryKey: ['workshops'],
    queryFn: async () => {
      try {
        return await workshopApi.getAll();
      } catch (error) {
        console.error("Error fetching workshops:", error);
        throw error;
      }
    },
  });
};

export const useWorkshop = (id: number) => {
  return useQuery({
    queryKey: ['workshop', id],
    queryFn: async () => {
      try {
        return await workshopApi.getById(id);
      } catch (error) {
        console.error(`Error fetching workshop with id ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
  });
};

export const useMyRegistrations = () => {
  return useQuery({
    queryKey: ['my-registrations'],
    queryFn: async () => {
      try {
        return await registrationApi.getMy();
      } catch (error) {
        console.error("Error fetching my registrations:", error);
        throw error;
      }
    },
  });
};

export const useRegisterForWorkshop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        return await registrationApi.create(data);
      } catch (error) {
        console.error("Error registering for workshop:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-registrations'] });
      queryClient.invalidateQueries({ queryKey: ['workshops'] });
    },
  });
};