package org.finpro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class InvoiceAppApplication {
    public static void main(String[] args) {
       //Uncomment below line if you are running on local machine and have set up Google Cloud credentials.
        //System.setProperty("GOOGLE_APPLICATION_CREDENTIALS", "C:\\Users\\Poonam\\AppData\\Roaming\\gcloud\\application_default_credentials.json");
       SpringApplication.run(InvoiceAppApplication.class, args);
    }
}