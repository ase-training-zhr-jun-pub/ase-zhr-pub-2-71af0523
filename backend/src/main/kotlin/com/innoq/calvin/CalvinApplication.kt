package com.innoq.calvin

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CalvinApplication

fun main(args: Array<String>) {
    runApplication<CalvinApplication>(*args)
}
