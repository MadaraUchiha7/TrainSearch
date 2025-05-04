package com.ali.Train.controller;


import com.ali.Train.entity.Station;
import com.ali.Train.entity.Train;
import com.ali.Train.entity.TrainSchedule;
import com.ali.Train.repo.StationRepository;
import com.ali.Train.repo.TrainRepository;
import com.ali.Train.repo.TrainScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class APIController {
    @Autowired
    StationRepository stationRepository;

    @Autowired
    TrainRepository trainRepository;

    @Autowired
    TrainScheduleRepository trainScheduleRepository;

    @GetMapping

    public void api(){
        Station delhi=new Station(null,"New Delhi","NDLS");
        Station mumbai=new Station(null,"Mumbai central","CST");
        Station kolkata=new Station(null,"Kolkata Sealdah","KOAA");
        Station chennai=new Station(null,"Chennai Central","MAS");

        stationRepository.saveAll(List.of(delhi,mumbai,kolkata,chennai));

        Train rajdhani = new Train(null,"Rajdhani Express","12306",null);
        Train durunto = new Train(null,"Durunto Express","12260",null);
        Train shatabdi = new Train(null,"Shatabdi Express","12043",null);

        trainRepository.saveAll(List.of(rajdhani,durunto,shatabdi));


        TrainSchedule sc1=new TrainSchedule(null,rajdhani,delhi,mumbai,"06:00","14:00");
        TrainSchedule sc2=new TrainSchedule(null,durunto,mumbai,kolkata,"08:00","21:00");
        TrainSchedule sc3=new TrainSchedule(null,shatabdi,kolkata,chennai,"11:30","19:00");

        trainScheduleRepository.saveAll(List.of(sc1,sc2,sc3));

    }
}
