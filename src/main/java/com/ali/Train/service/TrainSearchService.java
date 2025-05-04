package com.ali.Train.service;

import com.ali.Train.entity.TrainSchedule;
import com.ali.Train.repo.TrainScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainSearchService {

    private TrainScheduleRepository trainScheduleRepository;

    public TrainSearchService(TrainScheduleRepository trainScheduleRepository){
        this.trainScheduleRepository = trainScheduleRepository;
    }

    public List<TrainSchedule> findTrainByStaionCode(String sourceCode, String destinationCode) {
        return trainScheduleRepository.findBySource_StationCodeAndDestination_StationCode(sourceCode, destinationCode);
    }

    public List<TrainSchedule> findTrainByStaionName(String sourceName, String destinationName) {
        return trainScheduleRepository.findBySource_StationNameAndDestination_StationName(sourceName, destinationName);
    }
}
