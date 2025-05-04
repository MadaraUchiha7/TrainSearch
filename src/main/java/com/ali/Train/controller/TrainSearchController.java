package com.ali.Train.controller;

import com.ali.Train.entity.TrainSchedule;
import com.ali.Train.service.TrainSearchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/search")
@CrossOrigin
public class TrainSearchController {

    private TrainSearchService trainSearchService;

    public TrainSearchController(TrainSearchService trainSearchService){
        this.trainSearchService = trainSearchService;
    }
    @GetMapping("/by-code")
    public List<TrainSchedule> findTrainByStationCode(@RequestParam String sourceCode, @RequestParam String destinationCode){
        return trainSearchService.findTrainByStaionCode(sourceCode.toUpperCase(), destinationCode.toUpperCase());
    }
    @GetMapping("by-name")
    public List<TrainSchedule> findTrainByStationName(@RequestParam String sourceName, @RequestParam String destinationName){
        return trainSearchService.findTrainByStaionName(sourceName.toUpperCase(), destinationName.toUpperCase());
    }

}
