package com.bmi.servlet;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;

/**
 * BMI Calculator Servlet
 * POST /api/bmi  →  { bmi, category, idealMin, idealMax, tip }
 */
@WebServlet("/api/bmi")
public class BMIServlet extends HttpServlet {

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse res) throws IOException {
        setCors(res);
        res.setStatus(200);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException {
        setCors(res);
        res.setContentType("application/json;charset=UTF-8");
        PrintWriter out = res.getWriter();

        try {
            double weight = Double.parseDouble(req.getParameter("weight")); // kg
            double height = Double.parseDouble(req.getParameter("height")); // cm

            if (weight <= 0 || height <= 0) throw new IllegalArgumentException("Invalid input");

            double heightM = height / 100.0;
            double bmi     = weight / (heightM * heightM);
            bmi = Math.round(bmi * 10.0) / 10.0;

            String category = getCategory(bmi);
            double idealMin = Math.round(18.5 * heightM * heightM * 10.0) / 10.0;
            double idealMax = Math.round(24.9 * heightM * heightM * 10.0) / 10.0;
            String tip      = getTip(category);

            out.print("{" +
                "\"bmi\":"        + bmi           + "," +
                "\"category\":\"" + category      + "\"," +
                "\"idealMin\":"   + idealMin      + "," +
                "\"idealMax\":"   + idealMax      + "," +
                "\"tip\":\""      + tip           + "\"" +
            "}");

        } catch (Exception e) {
            res.setStatus(400);
            out.print("{\"error\":\"Please enter valid weight and height.\"}");
        }
    }

    private String getCategory(double bmi) {
        if (bmi < 18.5) return "Underweight";
        if (bmi < 25.0) return "Normal weight";
        if (bmi < 30.0) return "Overweight";
        return "Obese";
    }

    private String getTip(String category) {
        switch (category) {
            case "Underweight":  return "Focus on nutrient-rich foods and strength training to build healthy mass.";
            case "Normal weight": return "Great work! Maintain your weight with balanced meals and regular activity.";
            case "Overweight":   return "A mix of cardio and mindful eating can help you reach a healthier range.";
            default:             return "Consult a doctor for a personalised plan. Small daily steps make a big difference.";
        }
    }

    private void setCors(HttpServletResponse res) {
        res.setHeader("Access-Control-Allow-Origin",  "*");
        res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
